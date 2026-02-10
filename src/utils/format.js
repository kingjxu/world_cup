const dateFormat = (val) => {
  let stamp;
  if (!val) return '';
  if (val instanceof Date) {
    stamp = val;
  } else {
    stamp = new Date(parseInt(val, 10));
  }
  return stamp.getFullYear() + '年'
    + ((stamp.getMonth()+1)<10?'0'+(stamp.getMonth()+1):stamp.getMonth()+1) + '月'
    + (stamp.getDate()<10?'0'+stamp.getDate():stamp.getDate()) + '日';
}

const answerFormat = (val, prop) => {
  if (!val || !prop) return '';
  if (!(val instanceof Array)) return '';
  const qa_item = val.filter((item) => item.question.includes(prop));
  return qa_item[0].answer;
}

export { dateFormat, answerFormat };