import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  width: 100%;
  min-width: 21.25rem;
  height: 100%;
  padding: 1rem;
  border-radius: 2rem;
  background-color: var(--dark-primary);

  @media (max-width: 420px) {
    min-width: 90vw;
  }
`;
