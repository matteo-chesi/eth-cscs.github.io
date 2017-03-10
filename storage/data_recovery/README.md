# Data Recovery

GPFS Snapshots provide an online backup that allows easy recovery from common problems such as accidental deletion of a file or the need to compare older versions of the same file. Snapshots of the entire GPFS file systems (/project, /users) are taken every day for the last seven days, while older snapshots are deleted automatically. Snapshots of a file system are read-only; changes can only be made to the active non-snapshots files and directories. 
How to restore a file from GPFS snapshots

GPFS snapshot creates a 
