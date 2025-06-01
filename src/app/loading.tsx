import { Spinner } from "@heroui/spinner";

export default function Loading() {
    return (
<div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
<p><Spinner  variant="dots" size="lg"/></p>
      </div>
    );
  }