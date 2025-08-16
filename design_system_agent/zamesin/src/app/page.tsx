import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans bg-white">
      {/* Navigation */}
      <nav className="px-4 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Advanced Jobs To Be Done «Как делать продукт» v.13
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-700 hover:text-black">Забронировать место</a>
            <a href="#" className="text-gray-700 hover:text-black">Подойдёт ли мне тренинг?</a>
            <a href="#" className="text-gray-700 hover:text-black">FAQ</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Научись делать продукт, который покупают
              </h1>
              <div className="space-y-3 text-lg text-gray-600">
                <p>Следующий поток стартует <strong>16 сентября 2025</strong></p>
                <p>Обновленная методология, ограниченное количество мест</p>
              </div>
              <button className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-lg">
                Забронировать место
              </button>
            </div>
            
            {/* Right Column - Video Preview */}
            <div className="space-y-6">
              <div className="relative bg-gray-200 rounded-2xl overflow-hidden aspect-video">
                {/* Video thumbnail with instructor */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  {/* Instructor photo - bald man in denim jacket making shush gesture */}
                  <div className="relative w-40 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {/* Face */}
                    <div className="absolute top-8 w-24 h-24 bg-amber-200 rounded-full">
                      {/* Eyes */}
                      <div className="absolute top-6 left-6 w-2 h-2 bg-gray-800 rounded-full"></div>
                      <div className="absolute top-6 right-6 w-2 h-2 bg-gray-800 rounded-full"></div>
                      {/* Nose */}
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-amber-300 rounded-full"></div>
                      {/* Mouth with finger gesture */}
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    {/* Denim jacket collar */}
                    <div className="absolute bottom-0 w-full h-16 bg-blue-600 rounded-b-full"></div>
                    {/* Finger for shush gesture */}
                    <div className="absolute top-16 right-8 w-1 h-8 bg-amber-200 rounded-full transform rotate-12"></div>
                  </div>
                </div>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white bg-opacity-95 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-opacity-100 transition-all hover:scale-105">
                    <div className="w-0 h-0 border-l-[20px] border-l-black border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent ml-2"></div>
                  </div>
                </div>
              </div>
              
              {/* Three badges */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium">
                  Без сложных IT-терминов
                </div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium">
                  Доступ сразу
                </div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium">
                  Видео на 65 минут
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Lecture Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Смотри <em className="italic font-normal">бесплатную</em> лекцию
          </h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start">
              <span className="text-gray-400 mr-3 mt-1">•</span>
              <span>Как отстроиться от конкурентов и создать уникальную ценность</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3 mt-1">•</span>
              <span>Как запустить новый продукт</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3 mt-1">•</span>
              <span>Как эффективнее растить существующий продукт</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3 mt-1">•</span>
              <span>Научную базу про то, как работает голова клиента</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Two-Column Learning Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Teal Background */}
            <div className="p-8 lg:p-12 rounded-2xl" style={{backgroundColor: '#D3F7FA'}}>
              <h3 className="text-2xl lg:text-3xl font-bold mb-6">
                Научись важному
              </h3>
              <div className="space-y-4 text-lg">
                <p>
                  Узнай, как проводить продуктовые исследования правильно — без 
                  пустых интервью и бесполезных опросов.
                </p>
                <p>
                  Разберись, почему клиенты покупают именно твой продукт, а не 
                  конкурентов.
                </p>
                <p>
                  Получи инструменты для создания продуктов, которые действительно 
                  решают проблемы людей.
                </p>
              </div>
            </div>
            
            {/* Right Column - White Background */}
            <div className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-200">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6">
                Получи алгоритм
              </h3>
              <div className="space-y-4 text-lg">
                <p>
                  Систематизируй знания в четкий алгоритм работы с продуктом.
                </p>
                <p>
                  Получи готовые шаблоны для интервью, анкет и анализа данных.
                </p>
                <p>
                  Научись применять Jobs To Be Done на практике — от идеи до 
                  запуска продукта.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Credentials Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl lg:text-3xl font-bold text-black">
                Эксперт №1
              </h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                Ваня Замесин — главный эксперт среди IT-менеджеров продукта в России
              </p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl lg:text-3xl font-bold text-black">
                10 000+
              </h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                менеджеров продуктов и предпринимателей прошли курс
              </p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl lg:text-3xl font-bold text-black">
                9.2/10
              </h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                средняя оценка ценности от студентов, прошедших курс
              </p>
            </div>
            
            {/* Stat 4 */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl lg:text-3xl font-bold text-black">
                Вечный доступ
              </h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                к материалам, обновлениям курса и сообществу
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results/Testimonials Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            Какой <em className="italic font-normal">результат</em> ты можешь получить пройдя тренинг
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Case Study 1 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black">
                Агентство недвижимости вырастило конверсию на 40%
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">До тренинга:</p>
                  <p className="text-sm text-black">
                    Сегментация по демографии не работала, продажи не росли
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">После тренинга:</p>
                  <p className="text-sm text-black mb-3">
                    Нашли сегменты и их графы работ, перестроили продажи
                  </p>
                  <div className="space-y-1">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium inline-block">
                      — конверсия в покупку +40%
                    </div>
                    <div className="text-sm text-black">
                      — ROMI 800% ➤ 1 400%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">Денис</p>
                    <p className="text-xs text-gray-600">CEO агентства Pleada</p>
                  </div>
                </div>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Читать полностью
                </a>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black">
                Новый IT-продукт принёс +5% выручки на клиента
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">До тренинга:</p>
                  <p className="text-sm text-black">
                    Было не очень понятно, что делать, а бизнес ждал стратегию
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">После тренинга:</p>
                  <p className="text-sm text-black mb-3">
                    Нашла возможность отстроиться от конкурентов новым продуктом
                  </p>
                  <div className="space-y-1">
                    <div className="text-sm text-black">
                      — выручка на клиента +5%
                    </div>
                    <div className="text-sm text-black">
                      — +90 миллионов в месяц для компании
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">Юлия</p>
                    <p className="text-xs text-gray-600">Product Manager Rossko</p>
                  </div>
                </div>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Читать полностью
                </a>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black">
                Фокус на сегменте дал +37% выручки для стоматологии
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">До тренинга:</p>
                  <p className="text-sm text-black">
                    Повторяли фичи за конкурентами, выручка не росла
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">После тренинга:</p>
                  <p className="text-sm text-black mb-3">
                    Узнали сегменты, сфокусировались, перестроили привлечение
                  </p>
                  <div className="space-y-1">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium inline-block">
                      — конверсия в продажу +40%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">Павел</p>
                    <p className="text-xs text-gray-600">CEO ArtDent</p>
                  </div>
                </div>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Читать полностью
                </a>
              </div>
            </div>

            {/* Case Study 4 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-black">
                Мы нашли денежный сегмент и средний чек вырос в три раза
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">До тренинга:</p>
                  <p className="text-sm text-black">
                    Неосознанно работали со сложным сегментом
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">После тренинга:</p>
                  <p className="text-sm text-black mb-3">
                    Нашли денежный сегмент, сделали комплексное решение и добавили статус
                  </p>
                  <div className="space-y-1">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium inline-block">
                      — средний чек 150k ➤ 450k
                    </div>
                    <div className="text-sm text-black">
                      — выручка +60%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-sm">Анастасия</p>
                    <p className="text-xs text-gray-600">CEO LiFT</p>
                  </div>
                </div>
                <a href="#" className="text-sm text-gray-600 hover:text-black">
                  Читать полностью
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section className="px-4 py-16" style={{backgroundColor: '#D3F7FA'}}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-black">
                Не знаете, что выбрать?
              </h2>
              <p className="text-xl lg:text-2xl text-black">
                <em className="italic">Оставь заявку</em>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                с тобой свяжется Ваня Замесин [не бот] и подскажет, подойдёт ли курс.
              </p>
            </div>
            
            {/* Right Column - Form */}
            <div>
              <form className="space-y-4">
                {/* Name Field - Full Width */}
                <input
                  type="text"
                  placeholder="Имя"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
                
                {/* Email and Telegram - Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ник в телеграм"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Checkbox */}
                <div className="flex items-start space-x-3 text-left pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                    Даю согласие на{' '}
                    <a href="#" className="text-black underline hover:no-underline">
                      обработку персональных данных
                    </a>
                  </label>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-lg mt-6"
                >
                  Отправить
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
