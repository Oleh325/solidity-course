export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
  }
  
  export interface networkConfigInfo {
    [key: string]: networkConfigItem
  }
  
  export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    sepolia: {
      ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      blockConfirmations: 6,
    },
    polygon: {
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        blockConfirmations: 2,
    },
  }
  
  export const developmentChains = ["hardhat", "localhost"]