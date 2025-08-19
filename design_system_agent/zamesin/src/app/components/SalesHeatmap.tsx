export default function SalesHeatmap() {
  // Generate heatmap data (simplified for the demo)
  const generateHeatmapData = () => {
    const data = [];
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const weeks = 7;
    const daysPerWeek = 7;
    
    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < daysPerWeek; day++) {
        // Generate random intensity values matching the reference image
        const random = Math.random();
        let intensity;
        if (random < 0.3) intensity = 0; // light blue
        else if (random < 0.5) intensity = 1; // medium blue
        else if (random < 0.7) intensity = 2; // dark blue
        else if (random < 0.85) intensity = 3; // darker blue
        else intensity = 4; // darkest blue
        
        weekData.push(intensity);
      }
      data.push(weekData);
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  // Color mapping based on the reference image
  const getColor = (intensity: number) => {
    const colors = [
      '#E3F2FD', // lightest blue
      '#81D4FA', // light blue  
      '#29B6F6', // medium blue
      '#1976D2', // dark blue
      '#0D47A1', // darkest blue
    ];
    return colors[intensity];
  };

  return (
    <div className="w-[360px] bg-white rounded-[20px] shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="px-[25px] py-[25px] space-y-[10px]">
        {/* Title and Settings Icon */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold leading-[1.3214285714285714em] text-black">
            Sales per employee per month
          </h1>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" fill="#000000"/>
              <path d="M10 5C11.1046 5 12 4.10457 12 3C12 1.89543 11.1046 1 10 1C8.89543 1 8 1.89543 8 3C8 4.10457 8.89543 5 10 5Z" fill="#000000"/>
              <path d="M10 19C11.1046 19 12 18.1046 12 17C12 15.8954 11.1046 15 10 15C8.89543 15 8 15.8954 8 17C8 18.1046 8.89543 19 10 19Z" fill="#000000"/>
            </svg>
          </div>
        </div>
        
        <p className="text-[16px] font-normal leading-[1.4375em] tracking-[0.03125em] text-[#383838]">
          263 contributions in the last year
        </p>
      </div>

      {/* Year Selection */}
      <div className="px-[25px] pb-[20px]">
        <div className="flex items-center gap-[8px]">
          <div className="bg-[#4A90E2] text-white px-[16px] py-[8px] rounded-[20px] text-[14px] font-medium">
            2016
          </div>
          <div className="border-2 border-black text-black px-[16px] py-[8px] rounded-[20px] text-[14px] font-medium">
            2017
          </div>
          <div className="border-2 border-black text-black px-[16px] py-[8px] rounded-[20px] text-[14px] font-medium">
            2018
          </div>
          <div className="border-2 border-black text-black px-[16px] py-[8px] rounded-[20px] text-[14px] font-medium">
            2019
          </div>
        </div>
      </div>

      {/* Heatmap Content */}
      <div className="px-[25px] pb-[15px]">
        <p className="text-[16px] font-normal leading-[1.4375em] tracking-[0.03125em] text-[#383838] mb-[20px]">
          Minim dolor in amet nulla laboris enim dolore consequatt.
        </p>
        
        {/* Month Labels */}
        <div className="flex justify-between mb-[8px] text-[14px] font-medium text-black">
          {months.map((month, index) => (
            <span key={index} className="w-[40px] text-center">
              {month}
            </span>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-[2px]">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-[2px]">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="w-[11px] h-[11px] rounded-[2px]"
                  style={{ backgroundColor: getColor(day) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-[25px] py-[20px] border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-normal text-[#383838]">
            Learn how we count contributions
          </span>
          
          {/* Legend */}
          <div className="flex items-center gap-[8px]">
            <span className="text-[12px] text-[#383838]">Less</span>
            <div className="flex gap-[2px]">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div
                  key={intensity}
                  className="w-[10px] h-[10px] rounded-[2px]"
                  style={{ backgroundColor: getColor(intensity) }}
                />
              ))}
            </div>
            <span className="text-[12px] text-[#383838]">More</span>
          </div>
        </div>
        
        <div className="mt-[15px] text-center">
          <button className="text-[14px] font-medium text-[#4A90E2] hover:underline">
            Show more activity
          </button>
        </div>
      </div>
    </div>
  );
}