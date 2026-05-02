import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { promises as fs } from 'fs'
import cloudinary, { cloudinaryUploadFolder, isCloudinaryConfigured } from '../lib/cloudinary.js';

export const addProduct = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: "Необходимо загрузить хотя бы одно изображение" });
    }

    const { name, composition, weight, weight1, weight2, price, category, popular } = req.body;
    if (!name || !composition || !weight || !weight1 || !weight2 || !price || !category) {
      return res.status(400).json({ success: false, message: "Обязательные поля: название, описание, цена и категория" });
    }

    const images: string[] = []
    const files = req.files as Record<string, Express.Multer.File[]>

    const uploadToCloudinary = async (file: Express.Multer.File) => {
      if (!isCloudinaryConfigured) {
        throw new Error(
          'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in server/.env',
        )
      }

      if (!file?.path) {
        throw new Error('Multer file path is missing')
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: cloudinaryUploadFolder,
        })
        return uploadResult.secure_url
      } finally {
        // Cleanup temp file after upload attempt.
        await fs.unlink(file.path).catch(() => {})
      }
    }

    for (let i = 1; i <= 4; i++) {
      const fileKey = `image${i}`
      const file = files?.[fileKey]?.[0]
      if (file) {
        const secureUrl = await uploadToCloudinary(file)
        images.push(secureUrl)
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        composition,
        weight: Number(weight),
        weight1: Number(weight1),
        weight2: Number(weight2),
        price: Number(price),
        categoryId: Number(category),
        image: images,
        popular: popular === "true",
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Add product error";
    res.status(500).json({ success: false, message });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Введите название категории",
      })
    }

    const exists = await prisma.category.findUnique({
      where: { name },
    })

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Категория уже существует",
      })
    }

    const category = await prisma.category.create({
      data: { name },
    })

    res.json({
      success: true,
      category,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Category add error"

    res.status(500).json({
      success: false,
      message,
    })
  }
}

export const removeCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Укажите ID категории",
      })
    }

    // Проверка, есть ли товары в категории
    const productsCount = await prisma.product.count({
      where: { categoryId: Number(id) },
    })

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Невозможно удалить категорию: в ней есть ${productsCount} товаров. Сначала удалите или переназначьте товары.`,
      })
    }

    await prisma.category.delete({ where: { id: Number(id) } })

    res.json({
      success: true,
      message: "Категория удалена",
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Category remove error"

    res.status(500).json({
      success: false,
      message,
    })
  }
}

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    res.json({
      success: true,
      categories,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "List categories error"

    res.status(500).json({
      success: false,
      message,
    })
  }
}

export const listProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ success: true, products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List products error";
    res.status(500).json({ success: false, message });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.body.id) } });
    res.json({ success: true, message: "Продукт удален" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Remove product error";
    res.status(500).json({ success: false, message });
  }
};

export const singleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    res.json({ success: true, product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get product error";
    res.status(500).json({ success: false, message });
  }
};
