export const todaysDate = () =>{
    const d = new Date();
    const today = `${
      d.getFullYear()
    }-${ 
      d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
    }-${
    d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    }`;
    return today;
  }