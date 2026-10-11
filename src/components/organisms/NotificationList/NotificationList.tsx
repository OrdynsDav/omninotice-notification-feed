import { useTab } from '@/hooks/useTab'
import React from 'react'

export default function NotificationList() {
    const {tab} = useTab()
  return (
    <div>{tab}</div>
  )
}
