"use client";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	return (
		<div>
			<form className={"flex flex-col space-y-4 py-4"}>
				<header>
					<h1 className={"px-2 font-semibold text-2xl"}>Gift Card</h1>
					<Separator className={"-mx-8 relative mt-6 mb-4"} />
				</header>

				<main className={"flex flex-col space-y-4"}>
					<div className={"flex flex-col space-y-2"}>
						<FileUploader
							onFileSelectAction={(file) => {
								console.log(file);
							}}
							label={"File Upload"}
						/>
					</div>

					<div className={"flex flex-col space-y-2"}>
						<Label
							htmlFor={"recipient"}
							className={"font-semibold text-slate-900"}
						>
							Dear
						</Label>
						<Input
							name={"recipient"}
							id={"recipient"}
							placeholder={"Recipient Name"}
							type={"text"}
							required={true}
						/>
					</div>

					<div className={"flex flex-col space-y-2"}>
						<Label
							htmlFor={"message"}
							className={"font-semibold text-slate-900"}
						>
							Message
						</Label>
						<Input
							name={"message"}
							id={"message"}
							placeholder={"Message"}
							type={"text"}
							required={true}
						/>
					</div>

					<div className={"flex flex-col space-y-2"}>
						<Label
							htmlFor={"sender"}
							className={"font-semibold text-slate-900"}
						>
							Sender
						</Label>
						<Input
							name={"sender"}
							id={"sender"}
							placeholder={"Sender Name"}
							type={"text"}
							required={true}
						/>
					</div>
				</main>

				<footer className={"flex w-full flex-col"}>
					<Separator className={"-mx-8 my-4"} />

					<div className={"flex w-full flex-row justify-center"}>
						<Button
							type={"submit"}
							className={
								"mt-4 w-fit bg-green-500 px-8 font-semibold text-white"
							}
						>
							Download
						</Button>
					</div>
				</footer>
			</form>
		</div>
	);
}
