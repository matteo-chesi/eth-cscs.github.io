# /project

__Users are NOT allowed to run jobs from this file system because of the low performance__. This is a shared - parallel file system based on the IBM GPFS software. It is accessible from the login nodes of all CSCS platforms using the native GPFS client through Infiniband or ethernet, however it is not mounted on the compute nodes of the computing systems.

The `$PROJECT` environment variable points to the personal folder `/project/<group_id>/<username>`. Data is backed up with GPFS snapshots and no cleaning policy is applied: it provides intermediate storage space for datasets, shared code or configuration scripts that need to be accessed from different platforms. Read and write performance increase using larger files, therefore you should consider to archive small files with the tar utility.

Access to `/project` is granted to all users with a production or large development project upon request at the time of proposal submission: please note that applicants should justify the requested storage as well as they do for compute resources. Each group folder has a quota space allocated that allows __50 K files per TB of disk space__.

__All data will be deleted 3 months after the end of the project  without further warning__
