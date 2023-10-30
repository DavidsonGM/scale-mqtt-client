import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Roboto:wght@100&display=swap');
  
  * {
    font-family: "Agbalumo", sans-serif;
    box-sizing: border-box;
    margin: 0;
  }
  
  :root {
    --dark-primary: #2C3333;
    --dark-secondary: #395B64;
    --light-secondary: #A5C9CA;
    --light-primary: #E7F6F2;
  }
`;
