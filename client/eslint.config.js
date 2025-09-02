import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [js.configs.recommended, eslintConfigPrettier, ...tseslint.configs.recommended],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react': reactPlugin,
			'jsx-a11y': jsxA11yPlugin,
			'react-refresh': reactRefresh,
			'import': importPlugin,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-hooks/exhaustive-deps': 'off',
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.tsx'] }],
			'no-bitwise': 'off',
			'no-restricted-syntax': 'off',
			'camelcase': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-prototype-builtins': 'off',
			'react/no-unescaped-entities': 'off',
			'no-unsafe-optional-chaining': 'off',
			'no-nested-ternary': 'off',
			'no-restricted-globals': 'warn',
			'no-await-in-loop': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react/jsx-max-props-per-line': ['error', { maximum: 6 }],
			'jsx-a11y/no-static-element-interactions': 'off',
			'jsx-a11y/label-has-associated-control': 'off',
			'jsx-a11y/click-events-have-key-events': 'off',
			'jsx-a11y/no-autofocus': 'off',
			'react/jsx-no-useless-fragment': 'off',
			'react/function-component-definition': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/prefer-default-export': 'off',
			'react/require-default-props': 'off',
			'react/no-array-index-key': 'off',
			'react/react-in-jsx-scope': 'off',
			'no-underscore-dangle': 'off',
			'import/no-unresolved': 'off',
			'no-param-reassign': 'off',
			'import/extensions': 'off',
			'no-shadow': 'off',
			'no-undef': 'off',
			'react/jsx-props-no-spreading': 'off',
			'no-return-await': 'warn',
		},
	},
);
