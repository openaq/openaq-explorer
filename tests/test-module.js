export const legendVals = [
    { option: '1', vals: ['0', '55', '155', '255', '355', '425', '605+'] }, // PM10 (µg/m³)
    { option: '2', vals: ['0', '12.1', '35.5', '55.5', '150.5', '250.5', '501+'] }, // PM2.5 (µg/m³)
    { option: '3', vals: ['0', '137.2', '323.4', '0.165', '401.5', '793.8', '1183.84+'] }, // O₃ mass (µg/m³)
    { option: '4', vals: ['0', '5122.5', '10943.5', '14086.8', '17928.7', '35391.7', '58675.7+'] }, // CO mass (µg/m³)
    { option: '5', vals: ['0', '101.5', '190', '679', '1222', '2350', '3852+'] }, // NO₂ mass (µg/m³)
    { option: '6', vals: ['0', '94.5', '199', '487.5', '799', '1585', '2630.5+'] }, // SO₂ mass (µg/m³)
    { option: '7', vals: ['0', '0.054', '0.101', '0.361', '0.65', '1.25', '2.05+'] }, // NO₂ (ppm)
    { option: '8', vals: ['0', '25', '35', '50', '87', '200', '400+'] }, // CO (ppm)
    { option: '9', vals: ['0', '0.094', '0.199', '0.487', '0.799', '1.585', '2.631+'] }, // SO₂ (ppm)
    { option: '10', vals: ['0', '0.055', '0.125', '0.165',' 0.205', '0.405','0.604+'] }, // O₃ (ppm)
    { option: '11', vals: ['0', '12.1', '35.5', '55.5', '150.5', '250.5', '501+'] }, // BC (µg/m³) - made a judgement call here
    { option: '12', vals: ['0', '12.1', '35.5', '55.5', '150.5', '250.5', '501+'] }, // PM1 (µg/m³)
    { option: '13', vals: ['0', '400', '1000', '2000', '3000', '4000', '5000+'] }, // CO₂ (ppm) - made a judgement call here
    { option: '14', vals: ['0', '615', '1230', '2460', '3690', '4920', '6150+'] }, // NOx mass (µg/m³)option: '
    { option: '15', vals: ['0', '0.094', '0.199', '0.487', '0.799', '1.585', '2.631+'] }, // CH₄ (ppm) - made a judgement call here 1000 ppm is limit for OSHA
    { option: '16', vals: ['0', '12.1', '35.5', '55.5', '150.5', '250.5', '501+'] }, // UFP count (particles/cm³)
    { option: '17', vals: ['0', '0.094', '0.199', '0.487', '0.799', '1.585', '2.631+'] }, // NO (ppm) - made a judgement call here
    { option: '18', vals: ['0', '12.1', '35.5', '55.5', '150.5', '250.5', '501+'] }, // PM1 count (particles/cm³
    { option: '19', vals: ['0', '0.094', '0.199', '0.487', '0.799', '1.585', '2.631+'] }, // PM2.5 count (particles/cm³) - made a judgement call here
    { option: '20', vals: ['0', '0.094', '0.199', '0.487', '0.799', '1.585', '2.631+'] }, // PM10 count (particles/cm³)
    { option: '21', vals: ['0', '0.5', '1', '2', '3', '4', '5+'] }, // NOx (ppm)
    { option: '22', vals: ['0', '4.5', '9.5', '12.5', '15.5', '30.5', '50.5+'] }, // NO mass (µg/m³) - made a judgement call here
    { option: '23', vals: ['0', '12.1', '35.5', '55.5', '150.5', '250.5', '501+'] }, // PM4 (µg/m³) *
    ];

export const parameters = [
    { parametersId: '1', label: 'PM10 (µg/m³)', xyz:'2/1/1'},
    // { parametersId: '2', label: 'PM2.5 (µg/m³)'}, // default
    { parametersId: '3', label: 'O₃ mass (µg/m³)', xyz: '2/3/2'},
    { parametersId: '4', label: 'CO mass (µg/m³)', xyz: '2/1/1'},
    { parametersId: '5', label: 'NO₂ mass (µg/m³)', xyz: '2/0/2'},
    { parametersId: '6', label: 'SO₂ mass (µg/m³)', xyz: '2/0/2'},
    { parametersId: '7', label: 'NO₂ (ppm)', xyz: '2/0/2'},
    { parametersId: '8', label: 'CO (ppm)', xyz: '2/0/2'},
    { parametersId: '9', label: 'SO₂ (ppm)', xyz: '2/0/2'},
    { parametersId: '10', label: 'O₃ (ppm)', xyz: '2/0/2'},
    { parametersId: '11', label: 'BC (µg/m³)', xyz: '2/0/2'},
    { parametersId: '19', label: 'PM1 (µg/m³)', xyz: '2/3/1'},
    { parametersId: '21', label: 'CO₂ (ppm)', xyz: '2/0/2'}, 
    { parametersId: '27', label: 'NOx mass (µg/m³)', xyz: '2/3/1'},
    { parametersId: '28', label: 'CH₄ (ppm)', xyz: '2/0/2'},
    { parametersId: '33', label: 'UFP count (particles/cm³)', xyz: '2/3/1'},
    { parametersId: '35', label: 'NO (ppm)', xyz: '2/0/2'},
    { parametersID: '126', label: 'PM1 count (particles/cm³', xyz: '2/1/1'},
    { parametersId: '130', label: 'PM2.5 count (particles/cm³)', xyz: '2/3/1'},
    { parametersId: '135', label: 'PM10 count (particles/cm³)', xyz: '2/3/1'},
    { parametersId: '19840', label: 'NOx (ppm)', xyz: '2/3/1'},
    { parametersId: '19843', label: 'NO mass (µg/m³)', xyz: '2/3/1'},
    { parametersId: '19844', label: 'PM4 (µg/m³)', xyz: '2/3/1'},
  ];