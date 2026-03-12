"use client";

import {
  DotsThreeIcon,
  PencilSimpleIcon,
  CopyIcon,
  ShareIcon,
  ArchiveIcon,
} from "@phosphor-icons/react";
import { PullDown } from "@/components/ui/animated/pull-down";

export default function PullDownDemo() {
  return (
    <div className="space-y-8">
      {/* Basic */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Basic
        </p>
        <div className="flex items-center justify-center min-h-[200px]">
          <PullDown anchor="center">
            <PullDown.Container
              buttonSize={40}
              menuWidth={160}
              menuRadius={12}
              className="bg-white dark:bg-neutral-800"
            >
              <PullDown.Trigger>
                <div className="flex h-10 w-10 items-center justify-center">
                  <DotsThreeIcon
                    className="h-5 w-5 text-muted-foreground"
                    weight="bold"
                  />
                </div>
              </PullDown.Trigger>
              <PullDown.Content className="p-1">
                <PullDown.Item onSelect={() => {}}>
                  <PencilSimpleIcon className="h-4 w-4 text-muted-foreground" />{" "}
                  Edit
                </PullDown.Item>
                <PullDown.Item onSelect={() => {}}>
                  <CopyIcon className="h-4 w-4 text-muted-foreground" /> Copy
                </PullDown.Item>
                <PullDown.Item onSelect={() => {}}>
                  <ShareIcon className="h-4 w-4 text-muted-foreground" /> Share
                </PullDown.Item>
                <PullDown.Separator />
                <PullDown.Item onSelect={() => {}}>
                  <ArchiveIcon className="h-4 w-4 text-muted-foreground" />{" "}
                  Archive
                </PullDown.Item>
              </PullDown.Content>
            </PullDown.Container>
          </PullDown>
        </div>
      </div>
    </div>
  );
}
