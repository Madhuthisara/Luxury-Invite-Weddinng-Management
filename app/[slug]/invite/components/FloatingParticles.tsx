import { motion } from 'framer-motion';

interface FloatingParticlesProps {
    isMounted: boolean;
}

export const FloatingParticles = ({ isMounted }: FloatingParticlesProps) => {
    if (!isMounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full bg-amber-400/20"
                    initial={{
                        x: Math.random() * 500,
                        y: 900,
                        scale: Math.random() * 0.7 + 0.3
                    }}
                    animate={{
                        y: -100,
                        x: `calc(${Math.random() * 500}px + ${Math.sin(i) * 40}px)`
                    }}
                    transition={{
                        duration: Math.random() * 12 + 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ left: `${(i + 1) * 11}%` }}
                />
            ))}
        </div>
    );
};
