export default function EconomiesChart() {
  return (
    <div className="w-[360px] bg-white rounded-[20px] shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="px-[25px] py-[25px] space-y-[10px]">
        <h1 className="text-[28px] font-bold leading-[1.3214285714285714em] text-black">
          Average of the first economies
        </h1>
        <p className="text-[16px] font-normal leading-[1.4375em] tracking-[0.03125em] text-[#383838]">
          Minim dolor in amet nulla laboris enim dolore consequatt.
        </p>
      </div>

      {/* Card Body */}
      <div className="px-[25px] pb-[25px] space-y-[12px]">
        {/* Countries Header */}
        <div className="flex justify-between items-center">
          <span className="text-[15px] font-normal leading-[1.171875em] text-black">
            List of countries
          </span>
          <span className="text-[15px] font-normal leading-[1.171875em] text-[#949494]">
            8 countries
          </span>
        </div>

        {/* Bar Chart */}
        <div className="space-y-0">
          {/* Noruega */}
          <div className="w-[310px] h-auto bg-[#F72585] rounded-t-[6px] px-[15px] py-[10px] flex items-center">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Noruega
            </span>
          </div>
          
          {/* Australia */}
          <div className="w-[280px] h-auto bg-[#B5179E] px-[15px] py-[10px] flex items-center rounded-r-[6px]">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Australia
            </span>
          </div>
          
          {/* Suiza */}
          <div className="w-[251px] h-auto bg-[#7209B7] px-[15px] py-[10px] flex items-center rounded-r-[6px]">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Suiza
            </span>
          </div>
          
          {/* Países Bajos */}
          <div className="w-[224px] h-auto bg-[#560BAD] px-[15px] py-[10px] flex items-center rounded-r-[6px]">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Países Bajos
            </span>
          </div>
          
          {/* Estados Unidos */}
          <div className="w-[195px] h-auto bg-[#480CA8] px-[15px] py-[10px] flex items-center rounded-r-[6px]">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Estados Unidos
            </span>
          </div>
          
          {/* Alemania */}
          <div className="w-[187px] h-auto bg-[#3A0CA3] px-[15px] py-[10px] flex items-center rounded-r-[6px]">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Alemania
            </span>
          </div>
          
          {/* Nueva Zelanda */}
          <div className="w-[133px] h-auto bg-[#3F37C9] px-[15px] py-[10px] flex items-center rounded-r-[6px]">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Nueva Zelanda
            </span>
          </div>
          
          {/* Canadá */}
          <div className="w-[101px] h-auto bg-[#4361EE] rounded-b-[6px] rounded-r-[6px] px-[15px] py-[10px] flex items-center">
            <span className="text-[15px] font-medium leading-[1.171875em] text-center text-white">
              Canadá
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-[25px] py-[25px]">
        <p className="text-[16px] font-normal leading-[1.4375em] tracking-[0.03125em] text-[#383838]">
          Minim dolor in amet nulla laboris enim dolore consequatt.
        </p>
      </div>
    </div>
  );
}