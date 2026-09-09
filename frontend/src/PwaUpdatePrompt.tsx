


import { useRegisterSW } from 'virtual:pwa-register/react'

export default function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string) {
      console.log('SW registered:', swUrl)
    },
    onRegisterError(error: unknown) {
      console.error('SW registration error', error)
    },
  })

  const close = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  if (!needRefresh && !offlineReady) return null

  return (
    <div className="fixed bottom-4 right-4 z-9999 max-w-xs rounded-lg border border-[#1c1f26] bg-[#0a0b0e] p-4 text-sm text-white shadow-xl">
      {needRefresh ? (
        <>
          <p className="mb-3">New version available.</p>
          <div className="flex gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className="rounded-md bg-[#5cd119] px-3 py-1.5 font-semibold text-black hover:bg-[#4fba14]"
            >
              Reload
            </button>
            <button
              onClick={close}
              className="rounded-md border border-[#2a2d34] px-3 py-1.5 text-white hover:bg-[#1c1f26]"
            >
              Dismiss
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-3">App ready to work offline.</p>
          <button
            onClick={close}
            className="rounded-md bg-[#5cd119] px-3 py-1.5 font-semibold text-black hover:bg-[#4fba14]"
          >
            OK
          </button>
        </>
      )}
    </div>
  )
}
