import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import '@/app/styles/index.css';

import { router } from '@/app/AppRouter';
import { StoreProvider } from '@/app/StoreProvider/ui/StoreProvider';
import { FontProvider } from '@/widgets/FontSwitcher';
import { HeroUIProvider } from '@heroui/react';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<StoreProvider>
			<FontProvider>
				<HeroUIProvider>
					<RouterProvider router={router} />
				</HeroUIProvider>
			</FontProvider>
		</StoreProvider>
	</StrictMode>,
);
