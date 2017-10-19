module.exports = {
	'extends': 'airbnb-base',
	'globals': {
	  'window': true,
	  'document': true
	},
	'rules': {
	  'no-console': 'off',
	  'no-alert': 'off',
	  'no-use-before-define': ['error', { 'functions': false, 'variables': false }],
	  'no-unused-vars': 'off',
	  'allowTernary': true 
	}
};
