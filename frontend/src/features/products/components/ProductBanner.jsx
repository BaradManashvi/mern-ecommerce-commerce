import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import MobileStepper from '@mui/material/MobileStepper';
import { Box, useTheme } from '@mui/material';

export const ProductBanner = ({ images }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  // Manual autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % maxSteps);
    }, 3000); // 3 seconds per slide

    return () => clearInterval(interval); // cleanup
  }, [maxSteps]);

  const handleNext = () => {
    setActiveStep(prev => (prev + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep(prev => (prev - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <SwipeableViews
        style={{ overflow: 'hidden' }}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((image, index) => (
          <div key={index} style={{ width: '100%', height: '100%' }}>
            {Math.abs(activeStep - index) <= 2 && (
              <Box
                component="img"
                sx={{ width: '100%', objectFit: 'contain' }}
                src={image}
                alt={`Banner Image ${index + 1}`}
              />
            )}
          </div>
        ))}
      </SwipeableViews>

      <div style={{ alignSelf: 'center', marginTop: '8px' }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={null}
          backButton={null}
        />
      </div>
    </>
  );
};
