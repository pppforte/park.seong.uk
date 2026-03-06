import Link from "next/link";
import { Home } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-svh flex items-center justify-center text-center px-10 pt-16">
      <div className="max-w-[480px]">
        <p className="text-[clamp(6rem,20vw,10rem)] font-extrabold leading-none tracking-tighter text-border mb-4 tabular-nums" aria-hidden="true">
          4<span className="text-accent">0</span>4
        </p>

        <h1 className="text-[clamp(1.25rem,4vw,1.75rem)] font-bold tracking-tight text-text mb-4">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="text-[0.9375rem] text-text-muted leading-[1.75] mb-10">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 다시 확인하거나, 아래 버튼으로 메인 페이지로 돌아가세요.
        </p>

        <div className="font-mono text-[0.8125rem] text-text-subtle bg-surface border border-border rounded-lg p-4 mb-10 text-left">
          <span className="text-text-subtle">$ </span>
          <span className="text-accent">GET</span>
          <span className="text-text-muted"> &mdash; 404 Not Found</span>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button as="a" href="/" variant="primary">
            <Home size={16} />
            홈으로 돌아가기
          </Button>
          <Button as="a" href="/#contact" variant="ghost">
            문의하기
          </Button>
        </div>
      </div>
    </main>
  );
}
