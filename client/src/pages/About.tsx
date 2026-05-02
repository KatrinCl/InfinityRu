
const About = () => {
  return (
    <div className='flex flex-col gap-5 mx-5 md:mx-20 md:my-10'>
      <h1 className='text-red-500 text-2xl md:text-3xl font-semibold'>О нас</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10'>
        <div className='flex flex-col gap-6 border border-red-500 rounded-xl p-8 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl'>Мы готовим домашнюю еду</h2>
          <p className='text-base md:text-lg'>Основа нашего меню - это проверенные десятилетиями домашние хиты. Однако мы не стоим на месте, экспериментируем с самыми разными кухнями мира и стараемся радовать наших гостей новинками. В составе блюд - только тщательно отобранные и проверенные ингредиенты</p>
        </div>

        <div className='flex flex-col gap-6 border border-red-500 rounded-xl p-8 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl'>Мы заботимся о вас</h2>
          <p className='text-base md:text-lg'>Забота о госте - одна из ключевых задач наших ресторанов. Мы работаем над меню, чтобы каждый мог найти себе блюдо по душе: и родители с детьми, и веганы, и сторонники ЗОЖ. Для нас важна обратная связь от гостей, поэтому мы всегда реагируем на ваши отзывы!</p>
        </div>

        <div className='flex flex-col gap-6 border border-red-500 rounded-xl p-8 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl'>Выгодные цены</h2>
          <p className='text-base md:text-lg'>Мы стараемся сделать наши цены доступными для всех, вводим разнообразные акции и скидки. А еще в наших ресторанах всегда можно заказать выгодные комбо-наборы из нескольких блюд.</p>
        </div>

        <div className='flex flex-col gap-6 border border-red-500 rounded-xl p-8 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl'>Система лояльности</h2>
          <p className='text-base md:text-lg'>Оформляя нашу бонусную карту, вы получаете возможность копить баллы от каждого заказа и оплачивать ими до 30% от покупки. Мы дарим бонусы за регистрацию карты и на ваш день рождения, а также проводим специальные акции среди участников системы лояльности.</p>
        </div>

        <div className='flex flex-col gap-6 border border-red-500 rounded-xl p-8 md:p-10'>
          <h2 className='text-red-600 text-xl md:text-2xl'>Бесплатная доставка</h2>
          <p className='text-base md:text-lg'>Чтобы порадовать себя любимыми блюдами, необязательно ехать в ресторан. Горячее, гарниры, супы, блюда гриль, десерты, напитки, а также комбо-наборы - все категории меню доступны для заказа на нашем сайте! Оформить бесплатную доставку можно также к определенному времени, либо выбрать самовывоз и получить двойной кешбэк на бонусную карту.</p>
        </div>
      </div>
    </div>
  )
}

export default About
