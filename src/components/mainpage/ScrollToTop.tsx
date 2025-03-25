import React, { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const MotionIconButton = motion(IconButton);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionIconButton
          aria-label="Scroll to top"
          icon={<ArrowUp size={20} />}
          size="lg"
          colorScheme="blue"
          variant="solid"
          position="fixed"
          bottom="6"
          right="6"
          zIndex={999}
          borderRadius="full"
          boxShadow="lg"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          bg="rgba(66, 153, 225, 0.9)"
          backdropFilter="blur(10px)"
          _hover={{
            bg: "rgba(66, 153, 225, 1)",
            transform: "translateY(-2px)",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;