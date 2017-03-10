# /store

__Users are NOT supposed to run jobs from this filesystem because of the low performance__. This is a shared - parallel filesystem based on the IBM GPFS software. All platforms can access /store using the native GPFS client through Infiniband or ethernet.

Data is backed up with GPFS snapshots and no cleaning policy is applied: it provides long term storage for large amount of datasets, code or scripts that need to be accessed from different platforms. It is also intended for large files: performance increases when using larger files, therefore you should consider archiving small files with the tar utility.

Access to `/store` can only be bought signing a contract with CSCS. Data and inode quotas are group based: the quota is enforced according to the signed contract.

__All data will be deleted 6 months after the end of the contract__
