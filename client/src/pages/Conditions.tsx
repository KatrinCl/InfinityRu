const Conditions = () => {
  return (
    <div className='flex flex-col gap-5 mx-6 md:mx-24 my-10'>
      <h1 className='text-red-500 text-2xl md:text-3xl font-semibold'>Условия доставки</h1>

      <div className='flex flex-col gap-8 md:gap-10 md:w-3/4 md:mt-4'>
        <div className='flex flex-col gap-4 border border-red-500 rounded-xl p-6 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl font-semibold'>Как сделать заказ</h2>
          <h3 className='font-semibold text-xl text-red-400'>На сайте</h3>
          <p className='text-base md:text-lg'>В разделе "Меню"</p>
        </div>

        <div className='flex flex-col gap-4 border border-red-500 rounded-xl p-8 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl font-semibold'>Как получить заказ</h2>

          <h3 className='font-semibold text-xl text-red-400'>Доставка курьером</h3>
          <p className='text-base md:text-lg'>Привезем заказ к вам домой или в офис</p>

          <h3 className='font-semibold text-xl text-red-400'>Доставка в указанное время</h3>
          <p className='text-base md:text-lg'>Укажите время, к которому вы хотите получить заказ</p>

          <h3 className='font-semibold text-xl text-red-400'>С собой</h3>
          <p className='text-base md:text-lg'>Самовывоз с ул. Садовая, д.3 и ул. Куконковых, д.141. Время приготовления — 30 минут. Двойной кешбэк.</p>
        </div>

        <div className='flex flex-col gap-4 border border-red-500 rounded-xl p-8 md:p-10 md:col-span-2'>
          <h2 className='text-red-600 text-xl md:text-2xl font-semibold'>Условия доставки ресторана</h2>

          <h3 className='font-semibold text-xl text-red-400'>Прием заказов</h3>
          <p className='text-base md:text-lg'>Пн-Вс 10:00–18:00</p>

          <h3 className='font-semibold text-xl text-red-400'>Территория доставки</h3>
          <p className='text-base md:text-lg'>г. Иваново</p>

          <h3 className='font-semibold text-xl text-red-400'>Бесплатная доставка</h3>
          <p className='text-base md:text-lg'>Вы оплачиваете только заказ</p>

          <h3 className='font-semibold text-xl text-red-400'>Минимальная сумма</h3>
          <p className='text-base md:text-lg'>400 ₽</p>

          <h3 className='font-semibold text-xl text-red-400'>Оплата</h3>
          <p className='text-base md:text-lg'>Онлайн или при получении (наличные / карта)</p>

          <h3 className='font-semibold text-xl text-red-400'>Время доставки</h3>
          <p className='text-base md:text-lg'>От 60 минут</p>
        </div>
      </div>
    </div>
  )
}

export default Conditions
