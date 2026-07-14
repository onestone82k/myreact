import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

// 1. 데이터 구조에 맞춰 타입 수정
interface Target {
  idx: number;
  biz_no: string;
  corp_nm: string;
}

interface MessageResponse {
  message: Target[]; // message는 Target 객체들의 배열입니다.
}

function ApiPage(){
  const [data, setData] = useState<string>("로딩 중...");
  
  useEffect(()=>{
    fetch(`/api/message`)
    .then((res) => res.json())
    .then((json: MessageResponse) => setData(json.message))
    .catch(()=>setData("데이터를 불러오지 못했습니다."));
  },[]);
 
  return(
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>API 통신 결과</h1>
      <p style={{ fontSize: '20px', color: '#646cff'}}>{data}</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default ApiPage;