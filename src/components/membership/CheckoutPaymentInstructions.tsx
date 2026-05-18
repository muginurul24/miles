import { ExternalLink } from 'lucide-react'
import { Button } from '#/components/ui/button'

import type { PaymentChannel } from '#/lib/payment-channels'
import type { ReactElement } from 'react'

export interface CheckoutPaymentInstructionsProps {
  ewalletActionUrl: string | null
  paymentChannel: PaymentChannel | undefined
  qrString: string | null
  qrUrl: string | null
  vaNumbers: Array<{ bank: string; vaNumber: string }>
}

export function CheckoutPaymentInstructions({
  ewalletActionUrl,
  paymentChannel,
  qrString,
  qrUrl,
  vaNumbers,
}: CheckoutPaymentInstructionsProps): ReactElement | null {
  if (vaNumbers.length > 0) {
    return (
      <div className="grid gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
        <p className="text-sm font-semibold text-primary">
          Nomor virtual account
        </p>
        {vaNumbers.map((item) => (
          <div
            key={`${item.bank}-${item.vaNumber}`}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="uppercase text-muted-foreground">{item.bank}</span>
            <span className="font-mono font-semibold text-primary">
              {item.vaNumber}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (paymentChannel?.category === 'ewallet') {
    return (
      <div className="grid gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
        <p className="text-sm font-semibold text-primary">
          Lanjutkan di {paymentChannel.shortName}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Buka aplikasi {paymentChannel.shortName}, konfirmasi pembayaran, lalu
          kembali ke halaman ini untuk melihat status terbaru.
        </p>
        {ewalletActionUrl ? (
          <Button asChild className="w-fit">
            <a
              href={ewalletActionUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Buka {paymentChannel.shortName}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </div>
    )
  }

  if (paymentChannel?.category === 'qris') {
    return (
      <div className="grid gap-4 rounded-2xl border border-border bg-secondary/50 p-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            Scan QRIS untuk membayar
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Gunakan aplikasi bank atau e-wallet yang mendukung QRIS dan bayar
            nominal yang sama persis.
          </p>
        </div>
        {qrUrl ? (
          <img
            src={qrUrl}
            alt="QRIS pembayaran membership"
            width={240}
            height={240}
            className="h-60 w-60 rounded-lg border border-border bg-background object-contain p-3"
          />
        ) : null}
        {qrString ? (
          <code className="overflow-x-auto rounded-md bg-background px-3 py-2 font-mono text-xs text-primary">
            {qrString}
          </code>
        ) : null}
      </div>
    )
  }

  return null
}
