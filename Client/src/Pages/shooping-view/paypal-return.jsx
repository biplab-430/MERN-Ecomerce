import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { capturePayment } from '@/store/Order-slice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

function PaypalReturn() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paymentId = params.get("token")      // PayPal token
    const payerId = params.get("PayerID")      // PayPal PayerID

    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"))
      if (!orderId) {
        console.error("No orderId found in sessionStorage")
        return
      }

      dispatch(capturePayment({ orderId, paymentId, payerId }))
        .unwrap()
        .then((data) => {
          if (data.success) {
            sessionStorage.removeItem("currentOrderId")
            navigate("/shop/payment-success")
          } else {
            console.error("Capture failed:", data.message)
          }
        })
        .catch((err) => console.error("Capture error:", err))
    }
  }, [location.search, dispatch, navigate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment...please wait</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PaypalReturn
