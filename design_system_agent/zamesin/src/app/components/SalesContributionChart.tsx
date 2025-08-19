'use client'

import React, { useState } from 'react'

interface ContributionDay {
  level: 0 | 1 | 2 | 3 | 4
}

const SalesContributionChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2016)
  const years = [2016, 2017, 2018, 2019]
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']

  // Generate contribution data for the heatmap (6 rows × 11 columns each)
  const generateContributionData = (): ContributionDay[][] => {
    const data: ContributionDay[][] = []
    for (let week = 0; week < 6; week++) {
      const weekData: ContributionDay[] = []
      for (let day = 0; day < 11; day++) { // 11 rectangles per row
        // Create realistic contribution patterns based on the Figma design
        let level: 0 | 1 | 2 | 3 | 4 = 0
        
        // Pattern matching the exact Figma design
        // Week 0 (first row) - all light blue
        if (week === 0) level = 0
        
        // Week 1 (second row)
        if (week === 1) {
          if (day === 1) level = 2 // Medium blue
          else if (day === 3 || day === 4) level = 4 // Dark blue  
          else if (day === 7) level = 3 // Primary blue
          else level = 0 // Light blue
        }
        
        // Week 2 (third row)  
        if (week === 2) {
          if (day === 1) level = 2 // Medium blue
          else if (day === 4) level = 4 // Dark blue
          else if (day === 5 || day === 6) level = 3 // Primary blue
          else if (day === 9 || day === 10) level = 4 // Dark blue
          else level = 0 // Light blue
        }
        
        // Week 3 (fourth row)
        if (week === 3) {
          if (day === 1) level = 4 // Dark blue
          else if (day === 4) level = 3 // Primary blue
          else if (day === 5) level = 4 // Dark blue
          else if (day === 8 || day === 9) level = 3 // Primary blue
          else level = 0 // Light blue
        }
        
        // Week 4 (fifth row)
        if (week === 4) {
          if (day === 2) level = 3 // Primary blue
          else if (day === 3) level = 2 // Medium blue
          else if (day === 4 || day === 7) level = 3 // Primary blue
          else if (day === 5 || day === 6) level = 4 // Dark blue
          else level = 0 // Light blue
        }
        
        // Week 5 (sixth row)
        if (week === 5) {
          if (day === 1) level = 3 // Primary blue
          else if (day === 3) level = 3 // Primary blue
          else if (day === 9 || day === 10) level = 4 // Dark blue
          else level = 0 // Light blue
        }
        
        weekData.push({ level })
      }
      data.push(weekData)
    }
    return data
  }

  const contributionData = generateContributionData()

  const getContributionColor = (level: number): string => {
    switch (level) {
      case 0:
        return '#E4F8FF' // Light blue
      case 1:
        return '#E4F8FF' // Light blue
      case 2:
        return '#90E0EF' // Medium blue
      case 3:
        return '#0077B6' // Primary blue
      case 4:
        return '#03045E' // Dark blue
      default:
        return '#E4F8FF'
    }
  }

  return (
    <div className="w-[360px] bg-white rounded-[20px] shadow-sm">
      {/* Card Header */}
      <div className="flex justify-between items-start gap-[10px] p-[25px]">
        <div className="flex-1">
          <h2 className="text-[28px] font-bold leading-[1.17] text-black font-['Roboto'] mb-0">
            Sales per employee per month
          </h2>
          <p className="text-[16px] font-normal leading-[2.5] text-black font-['Roboto'] mt-0 mb-0">
            263 contributions in the last year
          </p>
        </div>
        <div className="w-[40px] h-[40px] bg-[#F2F2F2] rounded-full flex items-center justify-center p-[10px]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1C13.4183 1 17 4.58172 17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1ZM8.5 5V8.5H5V9.5H8.5V13H9.5V9.5H13V8.5H9.5V5H8.5Z"
              fill="black"
            />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-[10px] px-[25px] pb-[25px]">
        {/* Year Filter Buttons */}
        <div className="flex items-center gap-[10px]">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-[16px] py-[9px] rounded-full font-['Roboto'] font-bold text-[11px] leading-[1.17] tracking-[0.727%] uppercase ${
                selectedYear === year
                  ? 'bg-[#0077B6] text-white'
                  : 'bg-transparent text-black border-2 border-black'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Description Text */}
        <p className="text-[16px] font-normal leading-[1.44] tracking-[3.125%] text-[#383838] font-['Roboto'] mb-0">
          Minim dolor in amet nulla laboris enim dolore consequatt.
        </p>

        {/* Chart Container */}
        <div className="flex flex-col gap-[10px]">
          {/* Month Labels */}
          <div className="flex justify-between items-center w-[310px]">
            {months.map((month) => (
              <span
                key={month}
                className="text-[14px] font-medium leading-[2.86] text-black font-['Roboto']"
              >
                {month}
              </span>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="rounded-[6px] flex flex-col gap-[2px]">
            {contributionData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex justify-between items-center w-[310px] gap-[10px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="w-[18px] h-[18px] rounded-[1px] flex-shrink-0"
                    style={{ backgroundColor: getContributionColor(day.level) }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-between items-center w-[310px]">
            <div className="flex items-center gap-[10px]">
              <span className="text-[13px] font-normal leading-[1.29] text-[#1B1B1B] font-['Roboto']">
                Learn how we{'\n'}count contributions
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="text-[13px] font-medium leading-[1.17] text-black font-['Roboto']">
                Less
              </span>
              <div className="w-[13px] h-[13px] rounded-[1px] bg-[#E4F8FF]" />
              <div className="w-[13px] h-[13px] rounded-[1px] bg-[#90E0EF]" />
              <div className="w-[13px] h-[13px] rounded-[1px] bg-[#0077B6]" />
              <div className="w-[13px] h-[13px] rounded-[1px] bg-[#03045E]" />
              <span className="text-[13px] font-medium leading-[1.17] text-black font-['Roboto']">
                More
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-[10px]">
        <button className="w-full bg-[#F3F3F3] rounded-[9px] px-[15px] py-[12px] flex items-center justify-center">
          <span className="text-[13px] font-normal leading-[1.29] text-black font-['Roboto']">
            Show more activity
          </span>
        </button>
      </div>
    </div>
  )
}

export default SalesContributionChart