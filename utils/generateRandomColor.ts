const randomNumber = (totalUsers: number, excludeColors: string[]) => {
  let randomNumber = Math.floor(Math.random() * 16).toString(16);
  if (excludeColors.includes(randomNumber)) {
    randomNumber = Math.floor(Math.random() * 16).toString(16);
  }
  return randomNumber;
};

const randomColorGenerator = (totalUsers: number, excludeColors: string[]) => {
  let randomColor = "#";
  for (let i = 0; i < 6; i++) {
    randomColor += randomNumber(totalUsers, excludeColors);
  }
  return randomColor;
};

// generate an array of unique websafe colors
export const generateColors = (totalUsers: number, excludeColors: string[] = []) => {
  const colors = [...excludeColors];
  for (let i = 0; i < totalUsers; i++) {
    colors.push(randomColorGenerator(totalUsers, colors));
  }
  return colors;
};
