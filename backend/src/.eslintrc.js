module.exports = {
   'env': {
      'es2020': true,
      'node': true
   },
   'extends': [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
   ],
   'parser': '@typescript-eslint/parser',
   'parserOptions': {
      'ecmaVersion': 12,
      'sourceType': 'module'
   },
   'plugins': [
      '@typescript-eslint'
   ],
   'rules': {
      'indent': [
         'error',
         3,
         {
            'MemberExpression': 'off'
         }
      ],
      'linebreak-style': [
         'error',
         'unix'
      ],
      'quotes': [
         'error',
         'single'
      ],
      'semi': [
         'error',
         'always'
      ]
   }
};
