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
export const checkFloatNumberInput = (val) => {
  if(val === '')
    return 0;
  if(val === '.')
    return '0.';
  
  let hasDot = false;
  for(let i = 0; i<val.length; i++)
  {
    if(!val[i].match(/^[0-9]*$/))
    {
      if(val[i] === '.')
      {
        if(hasDot === true ) 
        {
          return -1;
        }
        else
        {
          hasDot = true;
        }
      }
      else
      {
        return -1;
      }
    }
  }
  if(val[0] === '.' )
  {
    val = '0' + val;
  }
  return val;
  // let dot_ind = val.indexOf('.');
  // if(dot_ind === -1)
  // {
  //   let new_value = 0;
  //   for (let i = 0; i < val.length; i++) {
  //     if (val[i].match(/^[0-9]*$/)) {
  //       new_value = new_value * 10 + Number(val[i]);
  //     }
  //   }
  //   console.log(val);
  //   val = new_value;
  // }
  // else
  // {

  //   //clean val of multiple dots and numbers
  //   let val_no_letters = '';
  //   for(let i = 0; i<val.length; i++)
  //   {
  //     if (val[i].match(/^[0-9]*$/) || i === dot_ind) {
  //       val_no_letters = val_no_letters + val[i];
  //     }
  //   }
  //   val = val_no_letters;

  //   if(val[0] === '.')
  //   {
  //     return ('0' + val);
  //   }

  //   dot_ind = val.indexOf('.');
  //   let non_dec = 0;
  //   for(let i = 0; i < dot_ind; i++)
  //   {
  //       non_dec = non_dec*10 + Number(val[i]);
  //   }
  //   let dec = 0;
  //   for(let i = dot_ind+1; i<val.length; i++)
  //   {
  //       dec = dec * 10 + Number(val[i]);
  //   }
  //   dec = dec === 0 ? '' : dec;
  //   val = non_dec + '.' + dec;
  // }


  // return val;
}
export const cleanFloatNumberErrors = (val) => {
  if(typeof val  === 'number') return val
  if(val === '' || val === '.')
    return 0;
  //clean multiple dots and letter characters
  const dot_ind = val.indexOf('.');
  let val_num_only = '';
  for(let i = 0; i<val.length; i++)
  {
    if (val[i].match(/^[0-9]*$/) || i === dot_ind) {
      val_num_only = val_num_only + val[i];
    }
  }
  val = val_num_only;
  
  if(val[val.length-1] === '.')
  {
    val = val.substr(0, val.length-1);
  }
  if(val === '')
    return 0;
  return Number(val);
  // let dot_ind = val.indexOf('.');
  // if(dot_ind === -1)
  // {
  //   let new_value_as_number = 0;
  //   for (let i = 0; i < val.length; i++) {
  //     if (val[i].match(/^[0-9]*$/)) {
  //       new_value_as_number = new_value_as_number * 10 + Number(val[i]);
  //     }
  //   }
  //   return new_value_as_number;
  // }

  // if(val === '.')
  //   return 0;

  // //clean multiple dots and letter characters
  // let val_num_only = '';
  // for(let i = 0; val.length; i++)
  // {
  //   if (val[i].match(/^[0-9]*$/) || i === dot_ind) {
  //     val_num_only = val_num_only + val[i];
  //   }
  // }
  // val = val_num_only;
  // dot_ind = val.indexOf('.');
  // let non_dec = 0;
  // for(let i = 0; i < dot_ind; i++){
  //     non_dec = non_dec*10 + Number(val[i]);
  // }
  // let dec = 0;
  // for(let i = dot_ind+1; i<val.length; i++){
  //     dec = dec * 10 + val[i];
  // }
  // dec = dec === 0 ? '' : dec;
  // val = non_dec + '.' + dec;
  // return Number(val);
}