declare module '@nivo/pie' {
  // 간단히 any로 export 처리
  const Pie: any;
  export default Pie;
  export * from 'recharts'; // 필요에 따라 수정
}
