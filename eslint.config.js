import react_compiler from "eslint-plugin-react-compiler";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react_compiler,
    },
    rules: {
      "react-compiler/react-compiler": "warn",
    },
  },
];
