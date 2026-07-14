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

function ApiPage() {
  // 2. 초기값을 빈 배열로 설정
  const [data, setData] = useState<Target[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/message`)
      .then((res) => res.json())
      .then((json: MessageResponse) => {
        setData(json.message); // 배열이 그대로 들어갑니다.
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // 에러 처리 시에는 별도의 에러 상태를 두는 것이 좋습니다.
      });
  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>API 통신 결과</h1>
      {loading ? <p>로딩 중...</p> : (
        // 3. 배열을 순회하며 corp_nm을 출력
       <table style={{ margin: '0 auto', textAlign: 'left' }}>
        <thead>
          <tr><th>인덱스</th><th>사업자번호</th><th>기업명</th></tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.idx}>
              <td>{item.idx}</td>
              <td>{item.biz_no}</td>
              <td>{item.corp_nm}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}

export default ApiPage;