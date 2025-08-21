// 닉네임 중복체크 훅

import { useEffect, useRef, useState } from "react"
import api from "@/lib/axios"

type Status = "idle" | "checking" | "available" | "unavailable" | "error"

export function useNicknameAvailability(initialName = "") {
  const [value, setValue] = useState(initialName)
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  // 초기값이 바뀌면 동기화
  useEffect(() => {
    setValue(initialName)
    setStatus("idle")
    setMessage("")
  }, [initialName])

  useEffect(() => {
    // 2글자 미만이면 검사하지 않음
    if (!value || value.trim().length < 2) {
      setStatus("idle")
      setMessage("")
      return
    }
    // 기존 닉네임과 같으면 OK 취급
    if (value.trim() === initialName.trim()) {
      setStatus("available")
      setMessage("")
      return
    }

    setStatus("checking")
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const t = setTimeout(async () => {
      try {
        const res = await api.get("http://localhost:8080/api/auth/check-duplicate", {
          params: { username: value.trim() },
          signal: controller.signal,
        })
        const isDup = !!res.data?.username
        if (isDup) {
          setStatus("unavailable")
          setMessage("이미 사용 중인 닉네임입니다.")
        } else {
          setStatus("available")
          setMessage("사용 가능한 닉네임입니다.")
        }
      } catch (e: any) {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return
        setStatus("error")
        setMessage("중복 확인 중 오류가 발생했습니다.")
      }
    }, 400)

    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [value, initialName])

  const isValid = status === "available" // 저장 가능 여부에 사용

  return { value, setValue, status, message, isValid }
}