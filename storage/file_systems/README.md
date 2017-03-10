# File Systems

CSCS supports different file systems, whose specifications are summarized in the table below:
	
/scratch (Piz Daint) | /scratch (Clusters) | /users | /project | /store
 --- | --- | --- | --- | --- 
Type | Lustre | GPFS | GPFS | GPFS | GPFS
Quota |	Soft quota 1 M files | None | 10 GB/user | 100 K files | 50 K files/TB | As per contract
Expiration | 30 days | 30 days | None | End of the project | As per contract
Data Backup | None | None | Active | Active | Active
Access Speed | Fast | Fast | Slow  | Medium | Slow
Capacity | 6.2 PB | 1.4 PB | 86 TB | 5.7 PB | 4.4 PB

## /scratch

All users have a personal folder under the [/scratch](https://eth-cscs-github.io/storage/file_systems/scratch) file system.

## /users

Each user has a personal home folder under the [/users](https://eth-cscs-github.io/storage/file_systems/users) file system.

## /project

Production projects proposals can ask for group storage under the [/project](https://eth-cscs-github.io/storage/file_systems/project) file system.

## /store

Contractual partners can buy dedicated storage under the [/store](https://eth-cscs-github.io/storage/file_systems/store) file system.
