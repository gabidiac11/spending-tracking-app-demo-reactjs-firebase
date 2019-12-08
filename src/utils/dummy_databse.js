export const db = {
  stores:{
    '04fb7ac4-f003-46c0-a8eb-7cca7ba075ef': {
      name:'Lidle',
      address:'STR. BUCIUM, NR. 36, JUD. IASI, CARREFORE IASI 2 FELICIA',
      products:{
        '5d7c6cf5-af1e-4701-9f18-7c369646eb11':{
          name:'Cocal Cola',
          price:1.89,
          utility:false,
          category:1,
          tva:'B'
        }
      }
    }
  },
  tvas:{
    'A':19,
    'B':9
  },
  pCategories:{
    1:'Drinking',
    2:'Food',
    3:'Alchohol',
    4:'Sanitary',
    5:'Tech',
    7:'Casnic'
  },
  receipts:{
    '326ec3b0-e05a-4871-bred2e-6b058f20d9t69':{
      date:'2019/12/30',
      storeId:'04fb7ac4-f003-46c0-a8eb-7cca7ba075ef',
      products:{
        '5d7fdsc6cf5-afdsff1e-4701-9f18-7c369646eb11':{
          name:'Cocal Cola',
          price:1.89,
          utility:false,
          category:1,
          tva:'B',
          referenceId:'5d7c6cf5-af1e-4701-9f18-7c369646eb11'
        },
        '5d7c6cf5-af1e-4701-9f18-7c3696446eb11':{
          name:'Cocal Cola',
          price:1.89,
          utility:false,
          category:1,
          tva:'B',
          referenceId:'5d7c6cf5-af1e-4701-9f18-7c369646eb11'
        }
      },
      total:1.89,
      payment:'Card'
    }
  }
}