import styled from "styled-components";

export const Page = styled.section`
  min-height: 100vh;
  background-color: var(--dark-primary);
  display: flex;
  flex-direction: column;
  gap: 4rem;
  justify-content: center;
  align-items: center;

  h1 { color: var(--light-primary) }
  
`;

export const SelectBox = styled.section`
  width: 90%;
  max-width: 30rem;
  align-self: flex-end;
  margin: 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 12;
  
  h4 { color: var(--light-primary) }
`;

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
