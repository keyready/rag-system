import type { AppDispatch } from '@/app/StoreProvider/config/store';

import { useDispatch } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
