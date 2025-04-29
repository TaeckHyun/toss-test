import React from "react";
import axios from "axios";

export default function Checkout() {
  const handlePayment = async () => {
    try {
      // 1. 백엔드에 결제 정보 요청
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/payments/toss/request",
        {
          amount: 10000,
          riceAmount: 100
        }
      );

      const tossPayments = window.TossPayments(data.clientKey); // 백엔드에서 받은 clientKey 사용

      // 2. 결제창 띄우기
      tossPayments
        .requestPayment("카드", {
          amount: data.amount,
          orderId: data.orderId,
          orderName: data.orderName,
          customerName: "택택",
          successUrl: data.successUrl,
          failUrl: data.failUrl,
        })
        .catch((error) => {
            if (error.code === "USER_CANCEL") {
                alert("사용자가 결제를 취소했습니다.");
          
                // Toss Payments가 제공하는 경우
                const paymentKey = error.paymentKey; 
                const orderId = error.orderId;       
                const amount = error.amount;         
          
                if (paymentKey && orderId && amount) {
                  axios.post("http://localhost:8080/api/v1/payments/toss/cancel", {
                    paymentKey: paymentKey,
                    orderId: orderId,
                    amount: amount,
                    cancelReason: "사용자 취소",
                  }).then(() => {
                    console.log("결제 취소 처리 완료");
                  }).catch((err) => {
                    console.error("결제 취소 처리 실패", err);
                  });
                }
              } else {
                console.error("결제 오류:", error);
                alert("결제 중 오류가 발생했습니다.");
              }
        });
    } catch (err) {
      console.error("결제 요청 실패", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>결제 페이지 (API 방식)</h2>
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}
