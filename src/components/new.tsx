"use client";

import { useState } from "react";

export default function ClientWidget() {
	const [count, setCount] = useState(0);

	return (
		<div className="mt-6 rounded-md border border-gray-200 p-4 bg-white">
			<h3 className="text-lg font-semibold text-gray-900">Client Widget</h3>
			<p className="mt-2 text-sm text-gray-600">This is a client component with simple interactivity.</p>
			<div className="mt-4 flex items-center gap-3">
				<button
					className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
					onClick={() => setCount((v) => v + 1)}
				>
					Increment
				</button>
				<button
					className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
					onClick={() => setCount(0)}
				>
					Reset
				</button>
				<span className="text-sm text-gray-800">Count: {count}</span>
			</div>
		</div>
	);
}
