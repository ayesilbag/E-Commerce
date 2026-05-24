# .NET SDK Version Issue Fix

## Problem
When running `dotnet ef` commands, the following error occurred:

```
Could not resolve SDK "Microsoft.NET.Sdk". Exactly one of the probing messages below indicates why we could not resolve the SDK.
  SDK resolver "Microsoft.DotNet.MSBuildWorkloadSdkResolver" returned null.
  The NuGetSdkResolver did not resolve this SDK because there was no version specified in the project or global.json.
error MSB4236: The SDK 'Microsoft.NET.Sdk' specified could not be found.
```

## Root Cause
An empty/corrupted SDK folder existed at `C:\Program Files\dotnet\sdk\9.0.304` (from a failed installation), causing MSBuild to incorrectly resolve to this incomplete SDK.

## Solution

### Option 1: Delete the Corrupted SDK Folder (Recommended)
Run this command in an **elevated PowerShell terminal** (Run as Administrator):

```powershell
Remove-Item -Path "C:\Program Files\dotnet\sdk\9.0.304" -Force -Recurse
```

After deleting, run commands normally:
```bash
dotnet ef database update --project src/Infrastructure --startup-project src/WebServer
```

### Option 2: Workaround Using Environment Variable
If you cannot delete the folder (no admin rights), use the `MSBuildSDKsPath` environment variable to force the correct SDK path:

```bash
# For Windows (Git Bash / WSL)
MSBuildSDKsPath="C:/Program Files/dotnet/sdk/9.0.301/Sdks" dotnet ef database update --project src/Infrastructure --startup-project src/WebServer

# For Windows (PowerShell)
$env:MSBuildSDKsPath="C:\Program Files\dotnet\sdk\9.0.301\Sdks"; dotnet ef database update --project src/Infrastructure --startup-project src/WebServer

# For Windows (Command Prompt)
set MSBuildSDKsPath=C:\Program Files\dotnet\sdk\9.0.301\Sdks && dotnet ef database update --project src/Infrastructure --startup-project src/WebServer
```

### Option 3: Update global.json (If Target SDK Doesn't Exist)
If the pinned SDK version in `global.json` is not installed:

```json
{
  "sdk": {
    "version": "9.0.301",
    "rollForward": "latestFeature"
  }
}
```

## Verification
Check installed SDK versions:
```bash
dotnet --list-sdks
```

## Related Commands
```bash
# Create a new migration
MSBuildSDKsPath="C:/Program Files/dotnet/sdk/9.0.301/Sdks" dotnet ef migrations add <MigrationName> --project src/Infrastructure --startup-project src/WebServer

# Update database
MSBuildSDKsPath="C:/Program Files/dotnet/sdk/9.0.301/Sdks" dotnet ef database update --project src/Infrastructure --startup-project src/WebServer

# Remove last migration
MSBuildSDKsPath="C:/Program Files/dotnet/sdk/9.0.301/Sdks" dotnet ef migrations remove --project src/Infrastructure --startup-project src/WebServer
```

---

**Date:** 2026-02-10
**Issue:** Empty SDK folder 9.0.304 causing MSBuild resolution failures
