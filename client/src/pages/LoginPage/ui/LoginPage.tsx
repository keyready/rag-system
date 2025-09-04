import { LoginCard } from '@/features/LoginUserCard';
import { Page } from '@/widgets/Page';

export const LoginPage = () => {
	return (
		<Page
			style={{
				backgroundImage: "url('/login-page-image.webp')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
			className="justify-center"
		>
			<LoginCard />
		</Page>
	);
};
