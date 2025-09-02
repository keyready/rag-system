import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

export const WelcomeChatScreen = () => {
	return (
		<motion.div
			key="welcome"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex h-6/8 w-3/4 flex-col items-center justify-center"
		>
			<img className="w-1/2" src="/logo.png" alt="Логотип" />
			<TypeAnimation
				sequence={[
					'Найдется все!',
					1000,
					'Интеллектуальная система поиска',
					1000,
					'Кратное повышение продуктивности',
					1000,
					'А что же было в том файле?',
					1000,
				]}
				speed={50}
				style={{
					textAlign: 'center',
					fontSize: '2em',
					display: 'inline-block',
					marginTop: '1rem',
				}}
				repeat={Infinity}
			/>
		</motion.div>
	);
};
