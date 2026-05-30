import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

function Home() {

    const location = useLocation();

        return (
            <AnimatePresence mode="wait">
                <motion.div key={location.pathname} 
                className="home"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                >
                    <h1>Home</h1>
                </motion.div>
            </AnimatePresence>
        );
    }

export default Home;