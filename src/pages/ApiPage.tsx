import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

// 1. 데이터 구조에 맞춰 타입 수정
interface Target {
  idx: number;
  biz_no: string;
  corp_nm: string;
}

interface MessageResponse {
  message: Target[];
}

function ApiPage() {
  const [data, setData] = useState<Target[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // 에러를 담을 상태 추가

  useEffect(() => {
    fetch(`/api/message`)
      .then((res) => {
        // 서버 응답이 200번대(정상)가 아니면 에러 발생시키기
        if (!res.ok) {
          throw new Error("서버 응답 오류");
        }
        return res.json();
      })
      .then((json: any) => {
        // [핵심 로직] 받아온 데이터(json.message)가 진짜 '배열'인지 한 번 더 확인!
        // 이렇게 하면 React error #31을 완벽히 막을 수 있습니다.
        if (json && Array.isArray(json.message)) {
          setData(json.message);
        } else {
          setError("데이터 형식이 올바르지 않습니다.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>API 통신 결과</h1>
      
      {/* 3단계 렌더링: 로딩 중 -> 에러 발생 -> 정상 출력 */}
      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ 
          margin: '0 auto', 
          textAlign: 'left', 
          borderCollapse: 'collapse', 
          width: '80%', 
          maxWidth: '600px' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>인덱스</th>
              <th style={{ padding: '12px' }}>사업자번호</th>
              <th style={{ padding: '12px' }}>기업명</th>
            </tr>
          </thead>
          <tbody>
            {/* 데이터가 비어있을 때의 처리 */}
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  등록된 기업 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{item.idx}</td>
                  <td style={{ padding: '12px' }}>{item.biz_no}</td>
                  <td style={{ padding: '12px' }}>{item.corp_nm}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '30px' }}>
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}

export default ApiPage;