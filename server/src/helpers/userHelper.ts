export function getReciprocalRelation(relation: string, gender: string): any {
    const relationsMap: Record<string, Record<string, string>> = {
      mother: {
        gender: 'female',
        female: 'daughter',
        male: 'son'
      },
      father: {
        gender: 'male',
        female: 'daughter',
        male: 'son'
      },
      daughter: {
        gender: 'female',
        female: 'mother',
        male: 'father'
      },
      son: {
        gender: 'male',
        female: 'mother',
        male: 'father'
      },
      grandfather:{
        gender: 'male',
        female: 'granddaughter',
        male:'grandson'
      },
      grandmother:{
        gender: 'female',
        female: 'granddaughter',
        male:'grandson'
      },
      grandson:{
        gender: 'male',
        female: 'grandmother',
        male:'grandfather',
      },
      granddaughter:{
        gender: 'female',
        female: 'grandmother',
        male:'grandfather',
      },
      aunt:{
        gender: 'female',
        female: 'neice',
        male: 'nephew'
      },
      uncle:{
        gender: 'male',
        female: 'neice',
        male: 'nephew'
      },
      'mother-in-law':{
        gender: 'female',
        female: 'daughter-in-law',
        male: 'son-in-law',  
      },
      'father-in-law':{
        gender: 'male',
        female: 'daughter-in-law',
        male: 'son-in-law',  
      },
      'brother-in-law':{
        gender: 'male',
        male: 'brother-in-law',
        female: 'sister-in-law'
      },
      'sister-in-law':{
        gender: 'female',
        male: 'brother-in-law',
        female: 'sister-in-law'
      }
    };
  
    const reciprocalRelation = relationsMap[relation]?.[gender];
    const reciprocalGender = relationsMap[relation]?.gender;
    return {reciprocalRelation:reciprocalRelation || 'family Member', reciprocalGender: reciprocalGender || 'others' };
  }