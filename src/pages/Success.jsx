import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios"; // axios import 추가

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/payments/toss/confirm",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${accessToken}`, // 필요 시 토큰 추가
            },
          }
        );

        // 결제 성공 비즈니스 로직
        console.log("결제 확인 성공:", response.data);

      } catch (error) {
        // 결제 실패 비즈니스 로직
        const { code, message } = error.response.data;
        navigate(`/fail?message=${message}&code=${code}`);
      }
    }

    confirm();
  }, [navigate, searchParams]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(searchParams.get("amount")).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
      </div>
    </div>
  );
}
