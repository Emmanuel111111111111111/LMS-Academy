export const getImageUrl = (path) => {
    return new URL(`/Assets/${path}`,import.meta.url).href;
};

export const handleAmount = (value, setAmount) => {
    let input = value.replace(/,/g, "");
  
    if (!/^\d*\.?\d*$/.test(input)) return;
  
    if (input.includes(".")) {
      const [, decimal] = input.split(".");
      if (decimal.length > 2) return;
    }
  
    setAmount(input);
};


export const formatNumberComma = (num) => {
    if (!num || Number(num) === 0) return "";
  
    const hasDecimal = num.includes(".");
    let [integer, decimal] = num.split(".");
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return decimal !== undefined ? `${integer}.${decimal}` : integer + (hasDecimal ? "." : "");
};  