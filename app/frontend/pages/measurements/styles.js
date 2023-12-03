import styled from "styled-components";

export const Page = styled.section`
  min-height: 100vh;
  background-color: var(--dark-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;  
  h4 {
    font-size: 1.25rem;
    color: var(--light-primary);
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  padding: 0 2rem;
`

export const SelectBox = styled.div`
  width: 100%;
  max-width: 40rem;
  align-items: center;
  display: flex;
  gap: 1rem;
  z-index: 12;
`;

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const MeasurementsChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 5rem 0;
  width: 100%;
  align-items: center;
  
  h1 { color: var(--light-secondary) }
`;

export const Statistics = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;
`

export const StatisticCard = styled.div`
  color: var(--light-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 11rem;
  justify-content: space-around;
  
  h3 {
    font-size: 1.5rem;
    color: var(--light-secondary);
  }
  
  span { 
    font-size: 4rem;
    //margin-top: 4rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
  }  
`

