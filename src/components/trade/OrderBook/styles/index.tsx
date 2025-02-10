import styled from 'styled-components';

export const Container = styled.div`
  display: block;
  max-height: 600px;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  border-color: #263946;
  position: relative;
  background: #1a1d26;
  border-radius: 8px;
  padding: 12px;

  @media only screen and (min-width: 800px) {
    flex-direction: row;
    justify-content: center;
  }

  .tooltip-container {
    position: absolute;
    background: rgba(30, 34, 45, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 12px;
    min-width: 200px;
    z-index: 1000;
    pointer-events: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
    
    .row-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #bfc1c8;
      font-size: 14px;
      
      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      div:last-child {
        color: #fff;
        font-weight: 500;
      }
    }
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const TableContainer = styled.div`
  position: relative;
  display: flex;
  max-height: 300px;
  overflow: auto;
  flex-direction: column;
  color: #bfc1c8;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .price-level-row-container {
    position: relative;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    &.selected {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;