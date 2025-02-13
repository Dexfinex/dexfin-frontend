import React, { useState } from "react";
import ChartLibrary from "./ChartLibrary";

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = () => {
  

  return (
    <div className="w-full h-full overflow-hidden glass">
          <ChartLibrary />
    </div>
  );
};

export default TechnicalAnalysis;